type NoHeaderAndFooterLayoutProps = {
  children: React.ReactNode;
};

const NoHeaderAndFooterLayout = ({
  children,
}: NoHeaderAndFooterLayoutProps) => {
  return <div>{children}</div>;
};

export default NoHeaderAndFooterLayout;
