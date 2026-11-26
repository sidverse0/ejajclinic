// All images are demo illustrations in /public/images.
// To use real photos: save them with the SAME file names (for example public/images/doctors/dr-faizul.jpg),
// then change IMAGE_EXT below to 'jpg' (or 'webp'). Nothing else needs to change.
export const IMAGE_EXT = 'svg';

export const imageSrc = (folder, name) => `/images/${folder}/${name}.${IMAGE_EXT}`;
