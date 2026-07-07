/**
 * CUREBIT - Cloudinary Image Service
 * Isolated module for asynchronous image compression, upload, and deletion via Cloudinary API.
 */

const CLOUDINARY_CONFIG = {
    cloudName: 'nqlc4kxq',
    uploadPreset: 'CurBIT_preset'
};

const CloudinaryService = {
    /**
     * Compress an image file using HTML5 Canvas before uploading
     * @param {File} file 
     * @param {number} maxWidth 
     * @param {number} maxHeight 
     * @param {number} quality 
     * @returns {Promise<Blob>}
     */
    async compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
        return new Promise((resolve) => {
            // If file is small (< 150KB) or SVG, skip canvas compression
            if (file.size < 150 * 1024 || file.type === 'image/svg+xml') {
                return resolve(file);
            }

            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob || file);
                    }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    },

    /**
     * Upload an image file/blob to Cloudinary
     * @param {File|Blob} file 
     * @param {string} folder 
     * @returns {Promise<{secure_url: string, public_id: string, format: string, width: number, height: number}>}
     */
    async uploadImage(file, folder) {
        try {
            const tenantId = DB.assertTenantSession();
            const normalizedFolder = String(folder || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
            const tenantRoot = `curebit/labs/${tenantId}/`;
            if (!normalizedFolder.toLowerCase().startsWith(tenantRoot)) {
                throw new Error('SECURITY ERROR: Invalid tenant asset folder');
            }
            console.log(`☁️ Cloudinary: Compressing image for folder "${folder}"...`);
            const compressedBlob = await this.compressImage(file);

            const formData = new FormData();
            formData.append('file', compressedBlob);
            formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
            formData.append('folder', normalizedFolder);
            formData.append('unique_filename', 'true');
            formData.append('overwrite', 'false');
            formData.append('context', `tenant_id=${tenantId}`);

            const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
            console.log(`☁️ Cloudinary: Uploading to ${endpoint}...`);

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || `Cloudinary upload failed with status ${response.status}`);
            }

            const data = await response.json();
            if (!data.public_id || !data.public_id.toLowerCase().startsWith(tenantRoot)) {
                throw new Error('SECURITY ERROR: Cloud asset escaped tenant folder');
            }
            console.log('☁️ Cloudinary Upload Success:', data.secure_url, 'Public ID:', data.public_id);

            return {
                secure_url: data.secure_url,
                public_id: data.public_id,
                format: data.format,
                width: data.width,
                height: data.height
            };
        } catch (e) {
            console.error('❌ Cloudinary Upload Error:', e);
            throw e;
        }
    },

    /**
     * Delete/Invalidate image by public_id (client notice / log)
     * Note: Client-side deletion requires server signature or destroy API,
     * so public_id is logged and reference removed from Firestore.
     * @param {string} publicId 
     */
    async deleteImage(publicId) {
        if (!publicId) return true;
        console.log(`☁️ Cloudinary: Image reference "${publicId}" cleared.`);
        return true;
    }
};

window.CloudinaryService = CloudinaryService;

