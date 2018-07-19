import React from 'react';

export function OptionsForm({ attributes, productType, callback }) {
  if (productType === 'variable') {
    return (
      <form method="GET">
        { attributes.map(attribute => {
          // Check if the attribute has color swatches
          // Use radio buttons instead
          if (attribute.swatches) {
            return (
              <ul className="attribute-options" key={attribute.name}>
                <h3>{attribute.name}</h3>
                <div className="swatch-options">
                  { attribute.options.map((option, i) => {
                    return (
                      <label
                        className="swatch-option-container"
                        htmlFor={`radio-${i}`}
                        key={i}>
                        <input
                          type="radio"
                          id={`radio-${i}`}
                          name={option.taxonomy}
                          value={option.slug}
                          style={{
                            position: 'absolute',
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                          onClick={callback}
                        />
                        <span
                          className="mark"
                          style={{
                            backgroundColor: attribute.swatches[option.name]
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </ul>
            );
          }
          // Otherwise, use a select dropdown
          return (
            <div className="attribute-options" key={attribute.name}>
              <h3>{attribute.name}</h3>
              <select
                name={attribute.taxonomy}
                onChange={callback}>
                <option value="">Select a {attribute.slug}</option>
                { attribute.options.map((option, i) => {
                  return (
                    <option
                      name={option.taxonomy}
                      value={option.slug}
                      key={i}>
                      {option.name}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        <button type="submit" className="add-to-cart">Add to cart</button>
      </form>
    );
  }
  if (productType === 'simple') {
    return (
      <form>
        <button type="submit" className="add-to-cart">Add to cart</button>
      </form>
    );
  }
  return null;
}
