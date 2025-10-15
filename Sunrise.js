/*

** Largely stolen from:
** http://free-solutions.schleu.de/js/tool_rechner_sunset.html
** I left some functions in their original German as a shout-out

Form is an object:
Form = {
  Long: -81.233,
  Lat : 42.9834,
  Zone : 0-(new Date()).getTimezoneOffset()/60,
  DOY: cardinal day of the year (1-366) (default: today)
};
*/

exports.get = (Form) => {
  const PI       = Math.PI;
  const RAD      = PI/180.0;
  const H        = -(50.0/60.0)*RAD;

  function dayOfYear(p1) {
    let yr = p1.getFullYear();
    let jan1 = new Date(yr+"-01-01T00:00Z");
    return ( Math.ceil((p1.getTime() - jan1.getTime()) / (24*60*60*1000)) );
  }
  if(typeof(Form.DOY) == "undefined") Form.DOY  = dayOfYear(new Date());

  let sonnendeklination = (T) => { return 0.40954*Math.sin(0.0172*(T-79.35));};

  function zeitdifferenz(Lat, Declination) {
    return 12.0*Math.acos((Math.sin(H) - Math.sin(Lat*RAD)*Math.sin(Declination)) / (Math.cos(Lat*RAD)*Math.cos(Declination)))/PI;
  }

  function zeitgleichung(T) {
    return -0.1752*Math.sin(0.033430 * T + 0.5474) - 0.1340*Math.sin(0.018234*T - 0.1939);
  }

  function compute(Form) {
    let DK = sonnendeklination(Form.DOY);
    Sunrise    = 12 - zeitdifferenz(Form.Lat, DK) - zeitgleichung(Form.DOY); 
    Sunset  = 12 + zeitdifferenz(Form.Lat, DK) - zeitgleichung(Form.DOY); 

    Sunrise = Sunrise - Form.Long /15.0 + Form.Zone;
    Sunset  = Sunset - Form.Long /15.0 + Form.Zone;
    let F=Math.floor;
    let pad2 = (s) => { return(('0'+s).slice(-2)); };

    SunriseH = F(Sunrise);
    SunriseM = (Sunrise - SunriseH)*60;
    SunriseS = F((SunriseM - F(SunriseM))*60);
    SunriseM = F(SunriseM);
    //Sunrise = ``;

    SunsetH = F(Sunset);
    SunsetM = (Sunset - SunsetH)*60;
    SunsetS = F((SunsetM - F(SunsetM))*60);
    SunsetM = F(SunsetM);
    //Sunset = ``;

    Form.Sunrise = `${pad2(SunriseH)}:${pad2(SunriseM)}:${pad2(SunriseS)}`;
    Form.Sunset = `${SunsetH}:${pad2(SunsetM)}:${pad2(SunsetS)}`;
    Form.EquationOfTime = 60.0*zeitgleichung(Form.DOY);
    Form.SunDeclination = DK/RAD;
    return Form;
  }

  return (compute(Form));
};



/*
A2 = date
B2 = Longitude
C2 = Latitude
D2 =  timezone (-4 or -5)
/
let A2 = new Date();
let B2 = 81.0;
let C2 = 42.0;
let DD2 = -5;

E2 =DAYS(A2); //, DATE(YEAR(A2);1;0));
F2 =(12+0.1752*Math.sin(0.03343*E2+0.5474)+0.134*Math.sin(0.0182334*E2-0.1939)-C2/15+24*DD2)/24;
G2 =0.40954*Math.sin(0.0172*(E2-79.35));
H2 =Math.acos((-0.0145-Math.sin(B2*Math.PI/180)*Math.sin(G2))/(Math.cos(B2*Math.PI/180)*Math.cos(G2)))/Math.PI;
I2 =F2-H2/2;
J2 =F2+H2/2;
*/
