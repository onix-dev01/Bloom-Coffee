type AuthSplitLayoutProps = {
  form: React.ReactNode;
  brand: React.ReactNode;
};

export function AuthSplitLayout({ form, brand }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">{form}</div>
      </div>
      <div className="hidden lg:flex">{brand}</div>
    </div>
  );
}
