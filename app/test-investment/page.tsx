"use client"

import { useState } from 'react'

export default function TestInvestmentPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testInvestmentAPI = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/investment/user-investments', {
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(`Error ${response.status}: ${data.error || 'Unknown error'}`)
        if (data.details) {
          setError(prev => prev + ` - ${data.details}`)
        }
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testPlansAPI = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/investment/plans', {
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(`Error ${response.status}: ${data.error || 'Unknown error'}`)
        if (data.details) {
          setError(prev => prev + ` - ${data.details}`)
        }
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuthAPI = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/test-investment-auth', {
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(`Error ${response.status}: ${data.error || 'Unknown error'}`)
        if (data.details) {
          setError(prev => prev + ` - ${data.details}`)
        }
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testDebugAPI = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/debug-investments', {
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(`Error ${response.status}: ${data.error || 'Unknown error'}`)
        if (data.details) {
          setError(prev => prev + ` - ${data.details}`)
        }
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Investment API Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testInvestmentAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded mr-4"
          >
            {loading ? 'Testing...' : 'Test Investment API'}
          </button>
          
          <button
            onClick={testPlansAPI}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded mr-4"
          >
            {loading ? 'Testing...' : 'Test Plans API'}
          </button>
          
          <button
            onClick={testAuthAPI}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded mr-4"
          >
            {loading ? 'Testing...' : 'Test Auth API'}
          </button>
          
          <button
            onClick={testDebugAPI}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            {loading ? 'Testing...' : 'Debug Investments'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded p-4 mb-4">
            <h3 className="text-red-200 font-semibold mb-2">Error:</h3>
            <pre className="text-red-100 text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {results && (
          <div className="bg-gray-800 border border-gray-700 rounded p-4">
            <h3 className="text-green-200 font-semibold mb-2">Results:</h3>
            <pre className="text-gray-100 text-sm whitespace-pre-wrap overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 