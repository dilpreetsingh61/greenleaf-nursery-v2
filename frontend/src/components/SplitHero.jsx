import React from 'react';

const SplitHero = ({ title, description, ctaLabel, ctaHref, imageSrc, imageAlt }) => {
  return (
    <section className="split-hero">
      <div className="split-hero-copy">
        <div className="split-hero-copy-inner">
          <h1>{title}</h1>
          <p>{description}</p>
          {ctaLabel ? (
            <a className="split-hero-btn" href={ctaHref || '#'}>
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
      <div className="split-hero-media">
        <img src={imageSrc} alt={imageAlt} />
      </div>
    </section>
  );
};

export default SplitHero;
