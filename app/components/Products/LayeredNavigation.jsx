import React from 'react';
import Link from 'react-router';

export const LayeredNavigation = props => {
  const { attributes } = props;
  return (
    <div className="layered-navigation">
      <h2>Layered Navigation</h2>
      { attributes &&
        attributes.map((attribute) => {
          return (
            <section className="filter-block">
              <h3>{attribute.name}</h3>
              <ul>
                { attribute.options.map((option, i) => {
                  return (
                    <li>
                      <Link to="#">{option[i]}</Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      }
    </div>
  );
};
