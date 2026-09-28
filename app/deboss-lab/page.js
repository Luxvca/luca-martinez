import { notFound } from "next/navigation";
import DebossLab from "./DebossLab";

export default function Page() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DebossLab />;
}
