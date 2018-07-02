import React from 'react';
import { Link } from 'react-router';
import { Loading } from '../../components/Content/Loading';
import { BLOG_SLUG } from '../../config/app';

// Infinite scroll loading
const SamePagePagination = (props) => {
  const {
    numPosts,
    totalPosts,
    starwardUpdating,
    posts,
    fetchMorePosts
  } = props;
  const fetchMoreButtonHandler = (event) => {
    if (event) event.preventDefault();
    if (!starwardUpdating) {
      fetchMorePosts(posts);
    }
  };
  if (numPosts < totalPosts) {
    if (starwardUpdating) {
      return (
        // fetching more posts, hide button, show loading spinner.
        <Loading fullscreen={false} />
      );
    }
    return (
      // More posts can be retrieved - show user button to fetch more.
      <Link to="#fetch-more" className="fetch-more-button" onClick={fetchMoreButtonHandler}>
        View more
      </Link>
    );
  }
  // No more posts to fetch, hide button.
  return <span />;
};

// Regular pagination method
const MultiPagePagination = (props) => {
  const { activePage, numPages } = props;
  const pagesArr = numPages > 1 ? Array.apply(null, Array(numPages)).map((x, i) => i + 1) : [];
  if (pagesArr.length < 1) {
    return <span />;
  }
  return (
    <ul>
      {pagesArr.map(page => (
        <li key={page} className={activePage === page ? 'page active' : 'page'}>
          <Link to={`/${BLOG_SLUG}/page/${page}`}>
            {page}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const Pagination = props => {
  const { samePage, posts, currentPage, fetchMorePosts, starwardUpdating } = props;
  const { items, totalItems, totalPages } = posts;
  if (samePage) {
    return (
      <nav className="page_nav">
        <SamePagePagination
          numPosts={items.length}
          totalPosts={totalItems}
          starwardUpdating={starwardUpdating}
          posts={posts}
          fetchMorePosts={fetchMorePosts}
        />
      </nav>
    );
  }
  return (
    <nav className="page_nav">
      <MultiPagePagination
        activePage={currentPage ? parseInt(currentPage) : 1}
        numPages={parseInt(totalPages)}
      />
    </nav>
  );
};
