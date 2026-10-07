(function(root){
 'use strict';
 const products=[{id:'coffee',name:'Coffee',price:4500,category:'Drinks'},{id:'sandwich',name:'Sandwich',price:5000,category:'Food'},{id:'soda',name:'Soft Drink',price:3500,category:'Drinks'},{id:'cookies',name:'Cookies',price:2500,category:'Snacks'},{id:'water',name:'Bottled Water',price:2000,category:'Drinks'},{id:'chocolate',name:'Chocolate',price:2500,category:'Snacks'}];
 const money=cents=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP'}).format(cents/100);
 const lines=cart=>products.filter(p=>cart[p.id]>0).map(p=>({...p,quantity:cart[p.id],subtotal:p.price*cart[p.id]}));
 const total=cart=>lines(cart).reduce((sum,p)=>sum+p.subtotal,0);
 function amount(value){const s=String(value).trim();if(!/^\d{1,7}(\.\d{1,2})?$/.test(s))return null;const [whole,fraction='']=s.split('.');return Number(whole)*100+Number(fraction.padEnd(2,'0'));}
 function validate(value,due){const paid=amount(value);if(paid===null)return {error:'Enter a valid, non-negative amount with up to two decimal places.'};if(paid<due)return {error:`Insufficient payment. Please enter at least ${money(due)}. You are short by ${money(due-paid)}.`};return {paid,change:paid-due};}
 function change(cart,id,delta){if(!products.some(p=>p.id===id)||!Number.isInteger(delta))throw Error('Invalid quantity');const next={...cart};next[id]=Math.max(0,Math.min(99,(next[id]||0)+delta));if(!next[id])delete next[id];return next;}
 const api={products,money,lines,total,amount,validate,change};root.POS=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
