export const metadata = { title: 'Staff admin', robots: { index: false, follow: false } };

export default function AdminLayout({ children }) {
  return <div className="admin-shell">{children}</div>;
}
