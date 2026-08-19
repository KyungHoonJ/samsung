'use client';

import { useEffect,useState } from 'react';
import { AdminNav } from '@/components/admin-nav';
import { adminFetch } from '@/lib/admin-api';
type Log={id:string;action:string;targetType:string;targetId?:string;ipAddress?:string;createdAt:string;admin?:{displayName:string;email:string}};
export default function AuditLogsPage(){const[logs,setLogs]=useState<Log[]>([]);const[error,setError]=useState('');useEffect(()=>{adminFetch<Log[]>('/admin/audit-logs').then(setLogs).catch(e=>setError(e.message));},[]);return <><AdminNav/><main className="admin-main container"><div className="admin-title"><div><p className="eyebrow">Security</p><h1>감사 로그</h1></div><strong>최근 200건</strong></div>{error&&<p className="form-error">{error}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>일시</th><th>관리자</th><th>작업</th><th>대상</th><th>IP</th></tr></thead><tbody>{logs.map(l=><tr key={l.id}><td>{new Date(l.createdAt).toLocaleString('ko-KR')}</td><td>{l.admin?.displayName||'시스템'}<small className="block">{l.admin?.email}</small></td><td>{l.action}</td><td>{l.targetType} {l.targetId?.slice(0,8)}</td><td>{l.ipAddress||'-'}</td></tr>)}</tbody></table></div></main></>}
