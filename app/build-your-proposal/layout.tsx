import { pageMetadata } from "@/lib/seo";
import PageSeoSchema from "@/components/seo/PageSeoSchema";

export const metadata = pageMetadata("/build-your-proposal");

export default function BuildYourProposalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageSeoSchema path="/build-your-proposal" />
      {children}
    </>
  );
}
