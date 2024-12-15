import { Menu, MoveLeft } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between p-4 border-b lg:hidden">
          <h1 className="text-xl font-bold">MindScribe</h1>
          <button>
            <Menu className="h-6 w-6" />
          </button>
        </header>
        <main className="p-6 lg:p-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Our Documentation
            </h2>
            <a href="/">
              <button className="flex items-center gap-4 border-2 rounded-xl border-black p-5 ">
                <MoveLeft /> Homepage
              </button>
            </a>
          </div>

          <p className="mb-4">
            Using mindscribe for the first time !! Lets get a quick walkthrough
          </p>
          <h3 className="text-2xl font-semibold mb-2">Getting Started</h3>
          <p className="mb-4">
            To get started with the project, follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Import your desired PDF</li>
            <li>
              You will get two panels a{" "}
              <span className="font-bold">pdf viewer panel</span> and{" "}
              <span className="font-bold">notes panel</span> with toolbar at the
              top
            </li>
            <li>
              In the <span className="font-bold">Notes panel</span> there are
              two views edit and preview, the notes panel supoorts markdown so
              you can write your notes in markdown content freely
            </li>
            <li>
              {" "}
              <span className="font-bold">Tagging a page</span> : Want to tag a
              page with your notes, just simply follow this format{" "}
              <span className="font-bold">[[page:(number of the page)]]</span>, after tagging there will be a panel to show no.of tagged pages
            </li>
            <li>Preview will show <span className="font-bold">Go to page:</span> which is linked directly to that page</li>
            <li>You can save your notes in markdown and txt file format</li>
            <li>Or Load your notes from your device </li>
          </ol>
        </main>
      </div>
    </div>
  );
}
