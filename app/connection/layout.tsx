import { Lato } from "next/font/google";
import "./connection.css";

// Tipografia do hub: Lato para display e corpo (300/400/700/900 + itálicos).
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
});

// LP de evento é chrome-free: navbar, tema e footer próprios do template.
export default function ConnectionLayout({ children }: { children: React.ReactNode }) {
  return <div className={`connection-root ${lato.className}`}>{children}</div>;
}
