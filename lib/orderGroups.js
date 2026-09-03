export function groupOrderRows(rows=[]){
 const groups=new Map();
 for(const row of rows){
  const key=row.checkout_id?`checkout:${row.checkout_id}`:`legacy:${row.id}`;
  if(!groups.has(key))groups.set(key,{...row,key,reference:row.checkout_id||row.id,items:[],total:0});
  const group=groups.get(key);
  group.items.push(row);
  group.total+=Number(row.total||0);
  if(new Date(row.created_at||0)>new Date(group.created_at||0))group.created_at=row.created_at;
 }
 return [...groups.values()].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));
}

export function shortOrderReference(order){
 const reference=String(order?.reference||order?.checkout_id||order?.id||'');
 return reference.length>12?reference.slice(-8).toUpperCase():reference;
}
