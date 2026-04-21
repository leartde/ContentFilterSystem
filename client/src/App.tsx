import './App.css'
import FetchRules from "./services/FetchRules.ts";
import { useEffect, useState } from "react";
import ViewRules from "./components/ViewRules.tsx";
import { FaMinus, FaPlus } from "react-icons/fa6";
import TextProcessor from "./components/TextProcessor.tsx";
import type { ViewRule } from "./types/ViewRule.ts";
import AddRule from "./components/AddRule.tsx";
import DeleteRule from "./services/DeleteRule.ts";
import EnableRule from "./services/EnableRule.ts";
import DisableRule from "./services/DisableRule.ts";

function App() {
  const [rules, setRules] = useState<ViewRule[]>([])
  const [openForm, setOpenForm] = useState(false);
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

  const handleDelete = async (id: number) =>  {
    const res =  await DeleteRule(id);
    if (res) {
      setRules(prev => prev.filter(rule => rule.id !== id));
    }
  }

  const handleEnable = async (id: number) => {
    const res = await EnableRule(id);
    if (res) {
      setRules(prev => prev.map(rule => rule.id === id ? {...rule, isEnabled: true} : rule));
    }
  }

  const handleDisable = async (id: number) => {
    const res = await DisableRule(id);
    if (res) {
      setRules(prev => prev.map(rule => rule.id === id ? {...rule, isEnabled: false} : rule));
    }
  }
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 bg-gray-200/60" id="main">
        <div className="border-2 border-gray-300 p-8 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900/80">Rule Management</h2>
          <ViewRules rules={rules} handleEnable={handleEnable} handleDisable={handleDisable} handleDelete={handleDelete}/>
          <button onClick={()=>setOpenForm(!openForm)} className="w-40 flex items-center justify-center gap-1 px-4 py-2 border cursor-pointer font-semibold shadow-sm border-gray-500 rounded-md bg-gray-400/20 text-gray-800 text-mde hover:bg-gray-300" type="button">
            {openForm ? <FaMinus className='text-gray-500' />: <FaPlus className='text-gray-500' />} Add New Rule
          </button>

          {openForm && <AddRule setRules={setRules}/>}
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
