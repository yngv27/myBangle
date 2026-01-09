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

###  ##  ###   ##
 #  #  # #  # #  #
 #  #  # #  # #  #
 #   ##  ###   ##
`;
    this.hdr=this.hdr1;
    this.height = 44;
    this.silent = false;
    this.filename = "todo.json";
  }
  footer() {return( "\n".padStart(this.height-this.list.length,"\n"));}
  aa(task) {this.a("A", task);}
  ab(task) {this.a("B", task);}
  a(pri,task) {this.list.push({task: task, pri: pri.toUpperCase()});this.ls();}
  p(id, pri){this.list[id].pri = pri.toUpperCase();this.ls();}
  formatList(ceil) {
    let str="", lastLevel = ' ';
    this.list.filter((x)=>{ return x.pri <= ceil; }).forEach((t,i)=>{
      if(lastLevel != t.pri) { lastLevel = t.pri; str+="-".padStart(48,"-")+"\n"; }
      str+=(`${i.toString().padStart(2,' ')}  (${t.pri}) ${t.task}`+"\n");
    });
    return(str);
  }
  ls(ceil) {
    this.sort();
    if(this.silent) return;
    if(!ceil) ceil='Z'; else ceil=ceil.toUpperCase();
    print(this.hdr); //"\n");
    print(this.formatList(ceil));
    print(this.footer());
  }
  d(id) {this.list.splice(id,1);this.ls();}
  top(id) {this.list.splice(0,0,this.list.splice(id,1)[0]); this.ls();}
  feh(id) {let t=this.list.splice(id,1); this.list.push(t[0]); this.ls();}
  sort() {
    this.list.sort((a,b)=>{return (a.pri >= b.pri ? 1 : -1);});
  }
  load() { this.list = _S.readJSON(this.filename);}
  save() {_S.writeJSON(this.filename, this.list);}
}
  
var DO = new todo();
DO.load();



