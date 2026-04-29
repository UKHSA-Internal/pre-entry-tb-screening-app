export interface PaginationProps {
  currentPage: number;
  maximumPage: number;
  onClickPrevious: () => void;
  onClickNext: () => void;
  onClickNumberedPage: (page: number) => void;
}

export default function Pagination(props: Readonly<PaginationProps>) {
  const previousPage = (
    <div className="govuk-pagination__prev">
      <a
        className="govuk-link govuk-pagination__link"
        rel="prev"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          props.onClickPrevious();
        }}
      >
        <svg
          className="govuk-pagination__icon govuk-pagination__icon--prev"
          xmlns="http://www.w3.org/2000/svg"
          height="13"
          width="15"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 15 13"
        >
          <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
        </svg>
        <span className="govuk-pagination__link-title">
          Previous<span className="govuk-visually-hidden"> page</span>
        </span>
      </a>
    </div>
  );

  const nextPage = (
    <div className="govuk-pagination__next">
      <a
        className="govuk-link govuk-pagination__link"
        rel="next"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          props.onClickNext();
        }}
      >
        <span className="govuk-pagination__link-title">
          Next<span className="govuk-visually-hidden"> page</span>
        </span>
        <svg
          className="govuk-pagination__icon govuk-pagination__icon--next"
          xmlns="http://www.w3.org/2000/svg"
          height="13"
          width="15"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 15 13"
        >
          <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
        </svg>
      </a>
    </div>
  );

  const ellipsis = <li className="govuk-pagination__item govuk-pagination__item--ellipsis">...</li>;

  const numberedPage = (pageNumber: number, isCurrent?: boolean) => {
    return (
      <li
        className={
          isCurrent
            ? "govuk-pagination__item govuk-pagination__item--current"
            : "govuk-pagination__item"
        }
        key={`page-${pageNumber}`}
      >
        <a
          className="govuk-link govuk-pagination__link"
          href="#"
          aria-label={`Page ${pageNumber}`}
          aria-current={isCurrent ? "page" : undefined}
          onClick={(e) => {
            e.preventDefault();
            if (!isCurrent) {
              props.onClickNumberedPage(pageNumber);
            }
          }}
        >
          {pageNumber}
        </a>
      </li>
    );
  };

  const beforeCurrentPage = () => {
    if (props.currentPage <= 1) {
      return null;
    } else if (props.currentPage < 4) {
      return (
        <>
          {numberedPage(1)}
          {props.currentPage > 2 && numberedPage(2)}
          {props.currentPage > 3 && numberedPage(3)}
        </>
      );
    } else {
      return (
        <>
          {numberedPage(1)}
          {ellipsis}
          {numberedPage(props.currentPage - 1)}
        </>
      );
    }
  };

  const afterCurrentPage = () => {
    if (props.currentPage >= props.maximumPage) {
      return null;
    } else if (props.currentPage > props.maximumPage - 4) {
      return (
        <>
          {props.currentPage < props.maximumPage - 2 && numberedPage(props.maximumPage - 2)}
          {props.currentPage < props.maximumPage - 1 && numberedPage(props.maximumPage - 1)}
          {numberedPage(props.maximumPage)}
        </>
      );
    } else {
      return (
        <>
          {numberedPage(props.currentPage + 1)}
          {ellipsis}
          {numberedPage(props.maximumPage)}
        </>
      );
    }
  };

  return (
    <nav className="govuk-pagination" aria-label="Pagination">
      {props.currentPage > 1 && previousPage}
      <ul className="govuk-pagination__list">
        {beforeCurrentPage()}
        {numberedPage(props.currentPage, true)}
        {afterCurrentPage()}
      </ul>
      {props.currentPage < props.maximumPage && nextPage}
    </nav>
  );
}
