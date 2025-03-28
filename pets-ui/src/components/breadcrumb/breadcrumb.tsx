import { Link } from "react-router-dom";
export interface IBreadcrumbItem {
  text: string;
  href: string;
}

export interface BreadcrumbProps {
  items: IBreadcrumbItem[];
}

export default function Breadcrumb(props: Readonly<BreadcrumbProps>) {
  return (
    <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
      <ol className="govuk-breadcrumbs__list">
        {props.items.map((item: IBreadcrumbItem, index: number) => (
          <li className="govuk-breadcrumbs__list-item" key={`breadcrumb-${index + 1}`}>
            <Link className="govuk-breadcrumbs__link" to={item.href}>
              {item.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
