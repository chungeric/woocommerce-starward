import React from 'react';
import { WP_URL } from '../../../server/config/app';

export function Gallery({baseImage, images, variations, selectedOptions}) {
  // console.log(variations);
  // console.log(selectedOptions);
  return (
    <div className="gallery">
      { baseImage &&
        <img
          src={`${WP_URL}${baseImage.src}`}
          alt={baseImage.src} />
      }
      { images.length > 1 &&
        images.map(image => {
          return (
            <img src={`${WP_URL}${image.src}`} alt={image.alt} key={image.position} />
          );
        })
      }
    </div>
  );
}
