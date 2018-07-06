import React from 'react';
import { Link } from 'react-router';

const queryObjectToString = (queryObj) => {
  if (!queryObj) return null;
  const queryString = Object.keys(queryObj).map(key => {
    return `${key}=${queryObj[key]}`;
  }).join('&');
  return `?${queryString}`;
};

const getQueryString = (queryObj, newKey, newValue) => {
  const queryStringsObj = queryObj;
  const newValueString = newValue.toString();
  // No filters applied
  if (!queryStringsObj || Object.keys(queryStringsObj).length < 1) return `?${newKey}=${newValueString}`;
  const keyExistsInQuery = (newKey in queryStringsObj);
  // If the attribute is already being filtered
  if (keyExistsInQuery) {
    const oldQueryArr = queryStringsObj[newKey].split(',');
    // If the new attribute option is not being filtered yet
    if (!oldQueryArr.includes(newValueString)) {
      // Add attribute option id to key
      const newQueryArr = [...oldQueryArr, newValueString];
      const newQueryString = newQueryArr.join(',');
      queryStringsObj[newKey] = newQueryString;
    } else {
      // If the new attribute option is already being filtered
      // Remove attribute option id from key
      const indexOfNewValue = oldQueryArr.indexOf(newValueString);
      oldQueryArr.splice(indexOfNewValue, 1);
      if (oldQueryArr.length < 1) {
        // Remove attribute key from query
        delete queryStringsObj[newKey];
      } else {
        // Remove option id from attribute options in query
        const newQueryString = oldQueryArr.join(',');
        queryStringsObj[newKey] = newQueryString;
      }
    }
  } else {
    // If the attribute is not currently being filtered
    // Create a new attribute key and add the attribute option to it
    queryStringsObj[newKey] = newValueString;
  }
  return queryObjectToString(queryStringsObj);
};

function PriceSlider({filter, index}) {
  if (filter && filter.min_price !== filter.max_price) {
    return (
      <section className="filter-block" key={index}>
        <h3>Price</h3>
        <label htmlFor="price">Price</label>
        <input type="range" id="price-slider" name="price" min={filter.min_price} max={filter.max_price} />
      </section>
    );
  }
  return null;
}

function AttributeFilter({attribute, urlBase, location}) {
  return (
    <section className="filter-block">
      <h3>{attribute.name}</h3>
      <ul>
        { attribute.options &&
          attribute.options.map((option, i) => {
            // Clone location query object so that we use the original location.query
            // for each attribute option
            const queryObj = location && Object.assign({}, location.query);
            const queryString = getQueryString(queryObj, attribute.slug, option.id);
            return (
              <li key={i}>
                <Link to={`/${urlBase}${queryString}`}>{option.name}</Link>
              </li>
            );
        })}
      </ul>
    </section>
  );
}

function SubCategoriesFilter({subcategories}) {
  if (subcategories.length > 0) {
    return (
      <section className="filter-block">
        <h3>Sub Categories</h3>
        <ul>
          { subcategories.map((subcategory, i) => {
            return (
              <li key={i}>
                <Link to={`/store/${subcategory.slug}`}>{subcategory.name}</Link>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }
  return null;
}

function renderAttributeFilters(filters, filterType, urlBase, location) {
  // For attributes we loop over all attributes and render each one in its
  // own separate filter block
  return Object.keys(filters[filterType]).map((attribute) => {
    const attributeDetails = filters[filterType][attribute];
    return (
      <AttributeFilter
        attribute={attributeDetails}
        urlBase={urlBase}
        location={location}
        key={attribute}
      />
    );
  });
}

const RenderFilterBlocks = ({filters, urlBase, location}) => {
  // Map over parent filter types i.e. Price, Attributes, Sub Categories
  if (!filters && filters.length < 1) return null;
  return (
    <div>
      {Object.keys(filters).map(filterType => {
        if (filterType === 'price') {
          return (
            <PriceSlider
              filter={filters[filterType]}
              key={filterType}
              location={location}
            />
          );
        }
        if (filterType === 'attributes') {
          return renderAttributeFilters(filters, filterType, urlBase, location);
        }
        if (filterType === 'subcategories') {
          return (
            <SubCategoriesFilter
              subcategories={filters[filterType]}
              key={filterType}
              location={location}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export const LayeredNavigation = props => {
  const { filters, urlBase, location } = props;
  console.log(filters);
  const categoryHasFilters = Object.keys(filters).length > 0;
  return (
    <div className="layered-navigation">
      { categoryHasFilters &&
        <h2>Layered Navigation</h2>
      }
      <RenderFilterBlocks
        filters={filters}
        urlBase={urlBase}
        location={location}
      />
    </div>
  );
};
