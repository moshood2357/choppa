import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { setToken } from '../utils/auth'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await api.post('/auth/login', {email,password})
      const token = res.data.token || res.data.access_token || res.data.data?.token
      if (!token) throw new Error('No token received')
      setToken(token)
      navigate('/', { replace: true })
    }catch(err){
      setError('Invalid credentials')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow">
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  )
}
