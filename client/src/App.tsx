import './App.css'
import FetchRules from "./services/FetchRules.ts";
import { useEffect, useState } from "react";
import ViewRules from "./components/ViewRules.tsx";
import { FaPlus } from "react-icons/fa6";
import TextProcessor from "./components/TextProcessor.tsx";
import type { ViewRule } from "./types/ViewRule.ts";

function App() {
  const [rules, setRules] = useState<ViewRule[]>([])
  useEffect(() => {
    const getRules = async () => {
      try{
        const res = await FetchRules();
        setRules(res);
      }
      catch (error) {
        console.error("Failed to fetch rules:", error);
      }}
    getRules();
  }, [])
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 bg-gray-200/60" id="main">
        <div className="border-2 border-gray-300 p-8 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900/80">Rule Management</h2>
          <ViewRules rules={rules}/>
          <button className="w-40 flex items-center justify-center gap-1 px-4 py-2 border cursor-pointer font-semibold shadow-sm border-gray-500 rounded-md bg-gray-300/20 text-gray-800 text-md hover:text-white hover:bg-gray-800" type="button">
            <FaPlus className='text-gray-500' /> Add New Rule
          </button>
        </div>


        <div className="border-2 border-gray-300 p-8 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900/80">Text Processing</h2>
          <TextProcessor />

        </div>

      </section>
    </>
  )
}

export default App
