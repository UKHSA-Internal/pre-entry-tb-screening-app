import { useNavigationHistory } from "@/utils/useNavigationHistory";

import LinkLabel from "../linkLabel/LinkLabel";

export interface BackLinkProps {
  fallbackUrl: string;
}

export default function BackLink(props: Readonly<BackLinkProps>) {
  const { goBack } = useNavigationHistory();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goBack(props.fallbackUrl);
  };

  return (
    <LinkLabel
      className="govuk-back-link"
      to={props.fallbackUrl}
      title="Back"
      externalLink={false}
      onClick={handleClick}
    />
  );
}
