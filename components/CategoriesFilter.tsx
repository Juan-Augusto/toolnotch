'use client'
import { Tool } from '@/app/[locale]/page' 
import { colorMap } from './ToolsSection'
export default function CategoriesFilter({TOOLS, setSelectedCategory, selectedCategory}: { TOOLS: Tool[], setSelectedCategory: (index: number | null) => void, selectedCategory: number | null }) {
    const filterToolsByCategory = (index: number) => {
      if (selectedCategory === index) {
        setSelectedCategory(null)
        return TOOLS
      }
      const filteredTools = TOOLS.filter((group) => group.index === index)
      setSelectedCategory(index)
      return filteredTools
    }
    return(
        <section className='flex flex-wrap gap-2 mb-6 min-w-full'>
          {TOOLS.map((tool, index) => {
            return <button key={tool.index} className={`border  cursor-pointer rounded-full px-2 ${selectedCategory === index ? `${colorMap[tool.color]}` : 'border-slate-300 dark:border-slate-500 text-slate-400 hover:text-slate-500 hover:border-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-400'}`}
              onClick={() => filterToolsByCategory(index)}
          
            >
              {tool.category}
            </button>
          })}
        </section>
    )
}