import { db } from './storage.js';
export function currentUser(){ return db.read().session; }
export function register({nid,name,nationality,email,phone,password}){
  const state = db.read();
  if(state.users.some(u=>u.email.toLowerCase()===email.toLowerCase())) throw new Error('El email ya está registrado');
  const id = 'u-'+crypto.randomUUID().slice(0,8);
  const user = { id, nid, name, nationality, email, phone, password, role:'user' };
  state.users.push(user);
  state.session = { id, email, name, role:'user' };
  db.setState(state);
  return state.session;
}
export function login({email,password}){
  const { users } = db.read();
  const u = users.find(u=>u.email.toLowerCase()===email.toLowerCase() && u.password===password);
  if(!u) throw new Error('Credenciales inválidas');
  const s = { id:u.id, email:u.email, name:u.name, role:u.role };
  const st = db.read(); st.session = s; db.setState(st);
  return s;
}
export function logout(){ const st = db.read(); st.session = null; db.setState(st); }
