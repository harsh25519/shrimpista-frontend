import { useState } from 'react'
import { Copy, BarChart2, Power, PowerOff, Edit2, Trash2, ExternalLink, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import type { UrlDashboardResponse, StatsResponse } from '@/types/api' 
import { urlsApi } from '@/api/urls'
import { analyticsApi } from '@/api/analytics'

interface LinkCardProps {
  link: UrlDashboardResponse
  onChanged: (updated: UrlDashboardResponse) => void
  onDeleted: (urlId: number) => void
}

export function LinkCard({ link, onChanged, onDeleted }: LinkCardProps) {
  // Construct the full backend URL for the short link
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'
  const fullShortUrl = `${backendBaseUrl}/urls/${link.shortCode}`

  // State for inline editing
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(link.title || '')
  const [editUrl, setEditUrl] = useState('')

  // State for stats panel
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl)
      toast.success('Short link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link.')
    }
  }

  const handleToggle = async () => {
    try {
      // 1. Await the API call to ensure the backend actually updated
      await urlsApi.toggle(link.urlId) 
      
      // 2. Manually construct the updated Dashboard object by flipping the boolean
      const toggledLink = { ...link, isActive: !link.isActive }
      
      // 3. Update the UI
      onChanged(toggledLink) 
      toast.success(`Link is now ${toggledLink.isActive ? 'active' : 'inactive'}`)
    } catch (err) {
      toast.error('Failed to update link status.')
    }
  }

  const handleDelete = async () => {
    try {
      await urlsApi.remove(link.urlId)
      onDeleted(link.urlId)
      toast.success('Link deleted permanently.')
    } catch (err) {
      toast.error('Failed to delete link.')
    }
  }

  // --- Edit Logic ---
  const handleSaveEdit = async () => {
    try {
      // Send both to the backend API
      await urlsApi.update(link.urlId, { title: editTitle, longUrl: editUrl })
      
      // Update ONLY the title in the UI state
      onChanged({ ...link, title: editTitle }) 
      
      setIsEditing(false)
      toast.success('Link updated successfully.')
    } catch (err) {
      toast.error('Failed to update link.')
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(link.title || '')
    setEditUrl('') 
    setIsEditing(false)
  }

  // --- Stats Logic ---
  // --- Stats Logic ---
  const handleStatsToggle = async () => {
    // FIX: Removed "&& !stats" so it fetches fresh data every time it opens
    if (!showStats) {
      setIsLoadingStats(true)
      try {
        const data = await analyticsApi.getStats(link.shortCode)
        setStats(data) // Overwrites the old state with the newly fetched count
      } catch (err) {
        toast.error('Failed to load analytics.')
      } finally {
        setIsLoadingStats(false)
      }
    }
    setShowStats(!showStats)
  }

  return (
    <div className="flex flex-col p-4 bg-[#14293a] border border-[#1f3a4e] rounded-xl mb-3 transition-all">
      
      {/* Top row: Main Link Info and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between w-full">
        
        {/* Left Side: Link Info */}
        <div className="mb-4 sm:mb-0 w-full sm:w-1/2">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${link.isActive ? 'bg-teal-900/50 text-teal-400' : 'bg-gray-800 text-gray-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${link.isActive ? 'bg-teal-400' : 'bg-gray-400'}`}></div>
              {link.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>

          {/* Conditional Rendering for Edit Mode */}
          {isEditing ? (
            <div className="flex flex-col gap-2 mt-2 mb-2 w-full pr-4">
              <input 
                type="text" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-[#0f2635] text-white border border-[#1f3a4e] rounded px-2 py-1 w-full text-sm focus:outline-none focus:border-teal-500"
                placeholder="Enter new title..."
                autoFocus
              />
              <input 
                type="url" 
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="bg-[#0f2635] text-white border border-[#1f3a4e] rounded px-2 py-1 w-full text-sm focus:outline-none focus:border-teal-500"
                placeholder="Enter new destination URL..."
              />
              <div className="flex gap-2 mt-1">
                <button onClick={handleSaveEdit} className="p-1 text-teal-400 hover:bg-teal-400/10 rounded flex items-center gap-1 text-xs">
                  <Check size={16} /> Save
                </button>
                <button onClick={handleCancelEdit} className="p-1 text-red-400 hover:bg-red-400/10 rounded flex items-center gap-1 text-xs">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <h3 className="font-medium text-white text-lg">{link.title || 'Untitled link'}</h3>
              <p className="text-sm text-gray-400 truncate max-w-full mt-1">
              </p>
            </div>
          )}
          
          {/* Clickable Short Link: Directs to backend redirect endpoint */}
          <a 
            href={fullShortUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-sm text-teal-400 hover:text-teal-300 hover:underline transition-colors w-fit"
          >
            {fullShortUrl}
            <ExternalLink size={14} />
          </a>

          <p className="text-xs text-gray-400 mt-2">
            Created {new Date(link.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-transparent hover:bg-white/5 border border-white/10 rounded-md text-gray-300 transition-colors">
            <Copy size={16} /> Copy
          </button>

          <button 
            onClick={handleStatsToggle} 
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${showStats ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-transparent hover:bg-white/5 border border-white/10 text-gray-300'}`}
          >
            <BarChart2 size={16} /> 
            Stats
            {showStats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button onClick={handleToggle} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-transparent hover:bg-white/5 border border-white/10 rounded-md text-gray-300 transition-colors">
            {link.isActive ? <PowerOff size={16} /> : <Power size={16} />}
            {link.isActive ? 'Disable' : 'Enable'}
          </button>

          <button onClick={() => setIsEditing(true)} disabled={isEditing} className="p-1.5 bg-transparent hover:bg-white/5 border border-white/10 rounded-md text-gray-300 transition-colors disabled:opacity-50">
            <Edit2 size={16} />
          </button>

          <button onClick={handleDelete} className="p-1.5 bg-transparent hover:bg-red-900/30 border border-white/10 hover:border-red-900/50 rounded-md text-red-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* --- Expandable Stats Panel --- */}
      {showStats && (
        <div className="mt-4 pt-4 border-t border-[#1f3a4e] animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-sm font-semibold text-white mb-3">Analytics Overview</h4>
          
          {isLoadingStats ? (
            <div className="flex items-center gap-2 text-sm text-teal-400/70 animate-pulse">
              <BarChart2 size={16} className="animate-bounce" /> Loading data...
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  
              <div className="p-4 bg-[#0f2635] rounded-lg border border-[#1f3a4e]">
                <p className="text-xs text-[#8c9fab] uppercase tracking-wider font-semibold mb-1">Total Clicks</p>
                <p className="text-2xl font-display text-teal-400 font-bold">
                  {stats.totalClicks ?? 0} 
                </p>
              </div>

              <div className="p-4 bg-[#0f2635] rounded-lg border border-[#1f3a4e]">
                <p className="text-xs text-[#8c9fab] uppercase tracking-wider font-semibold mb-1">Unique Visitors</p>
                <p className="text-2xl font-display text-teal-400 font-bold">
                  {stats.uniqueVisitors ?? 0} 
                </p>
              </div>

            </div>
          ) : (
            <p className="text-sm text-red-400">Could not retrieve analytics data.</p>
          )}
        </div>
      )}
    </div>
  )
}