/*
var t = {
  list: [],
  aa: (task)=>{t.a("A", task);},
  ab: (task)=>{t.a("B", task);},
  a: (pri,task)=>{t.list.push({task: task, pri: pri.toUpperCase(), id: t.list.length});},
  p: (id, pri)=>{t.list[id].pri = pri;},
  ls: (ceil)=>{
    if(!ceil) ceil='Z'; else ceil=ceil.toUpperCase();
    t.list.filter((x)=>{ return x.pri <= ceil; }).forEach((t,i)=>{print(`${t.id.toString().padStart(2,' ')}  (${t.pri}) ${t.task}`);});
    //t.list.forEach((t)=>{print(`${t.id.toString().padStart(2,' ')}  (${t.pri}) ${t.task}`);});
  },
  d: (id)=>{t.list.splice(id,1);},
  top: (id)=>{t.list.splice(0,0,t.list.splice(id,1)[0]);},
  sort: ()=>{
    t.list.sort((a,b)=>{return (a.pri > b.pri ? 1 : (a.pri == b.pri ? 0 : -1));});
  }
};
*/
// delete todo;
class todo {
  constructor() {
    this.list = [];
    this.hdr1 = `
OOO  OO  OOO   OO
 O  O  O O  O O  O
 O   OO  OOO   OO
`;
    this.hdr="";
    this.height = 44;
  }
  footer() {return( "\n".padStart(this.height-this.list.length,"\n"));}
  aa(task) {this.a("A", task);}
  ab(task) {this.a("B", task);}
  a(pri,task) {this.list.push({task: task, pri: pri.toUpperCase() /*, id: this.list.length*/});this.ls();}
  p(id, pri){this.list[id].pri = pri.toUpperCase();this.ls();}
  ls(ceil) {
    this.sort();
    if(!ceil) ceil='Z'; else ceil=ceil.toUpperCase();
    let lastLevel = ' ';
    print(this.hdr); //"\n");
    this.list.filter((x)=>{ return x.pri <= ceil; }).forEach((t,i)=>{
      if(lastLevel != t.pri) { lastLevel = t.pri; print("-".padStart(48,"-")); }
      print(`${i.toString().padStart(2,' ')}  (${t.pri}) ${t.task}`);
    });
    print(this.footer());
  }
  d(id) {this.list.splice(id,1);this.ls();}
  top(id) {this.list.splice(0,0,this.list.splice(id,1)[0]); this.ls();}
  feh(id) {let t=this.list.splice(id,1); this.list.push(t[0]); this.ls();}
  sort() {
    this.list.sort((a,b)=>{return (a.pri >= b.pri ? 1 : -1);});
  }
}
  
w = new todo();
n = new todo();

var j=JSON.stringify(w.list);
print(`
w.list = JSON.parse(\`${j}\`);
`);
j=JSON.stringify(n.list);
print(`
n.list = JSON.parse(\`${j}\`);
`);

//*
g.setFont6x15().setFontAlign(-1,-1).clear();
let y=0;
lastLevel = ' ';
g.clear();
w.list.forEach((t,i)=>{
  if(lastLevel != t.pri) { lastLevel = t.pri; g.drawLine(0,y-2,175,y-2);  }
  g.drawString(`${i.toString().padStart(2,' ')}  (${t.pri}) ${t.task}`,0,y);
   y+= 18;
});
//*/


