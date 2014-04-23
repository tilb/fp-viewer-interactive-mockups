 disegna_rettangolo = function(r){
     var d=new GLatLng(r.getSouthWest().lat(),r.getSouthWest().lng());
     var b=new GLatLng(r.getNorthEast().lat(),r.getNorthEast().lng());

     var a=new GLatLng(r.getNorthEast().lat(),r.getSouthWest().lng());
     var c=new GLatLng(r.getSouthWest().lat(),r.getNorthEast().lng());

     var polyline = new GPolyline([a,b,c,d,a],"#ff0000",4);
     this.addOverlay(polyline);
     return polyline;

 }


// Gestione rettangoli differenza
 // ==============================
 f_rettangoli=function(b0,b1){

     rettangoli=[];

     sy=(b1.getSouthWest().lat()-b0.getSouthWest().lat());
     sx=(b1.getSouthWest().lng()-b0.getSouthWest().lng());

     // Calcolo lo spostamento assoluto
     sya=Math.abs(b1.getSouthWest().lat()-b0.getSouthWest().lat());
     sxa=Math.abs(b1.getSouthWest().lng()-b0.getSouthWest().lng());

     ay=b0.getSouthWest().lat();
     ax=b0.getSouthWest().lng();
     by=b0.getNorthEast().lat();
     bx=b0.getNorthEast().lng();

     ayp=ay+sya;axp=ax+sxa;
     byp=by+sya;bxp=bx+sxa;

     cy=by;cx=axp;

     r=new GLatLngBounds();
     r.extend(new GLatLng(cy,cx));
     r.extend(new GLatLng(byp,bxp));
     r=this.f_simmetria(r,sx,sy,b0);
     rettangoli.push(r);
      
     dy=ayp;dx=bx;
     ey=by;ex=bxp;
     r=new GLatLngBounds();
     r.extend(new GLatLng(dy,dx));
     r.extend(new GLatLng(ey,ex));
     r=this.f_simmetria(r,sx,sy,b0);
     rettangoli.push(r);

     return rettangoli;

 }

 f_simmetria_lat=function(bordo,c_lat){


     b_out=new GLatLngBounds();
     
      dist_asse=/*Math.abs*/(bordo.getSouthWest().lat()-c_lat);
     n_lat=bordo.getSouthWest().lat()-2*dist_asse;
     b_out.extend(new GLatLng(n_lat,bordo.getSouthWest().lng()));
      
     dist_asse=/*Math.abs*/(bordo.getNorthEast().lat()-c_lat);
     n_lat=bordo.getNorthEast().lat()-2*dist_asse;
     b_out.extend(new GLatLng(n_lat,bordo.getNorthEast().lng()));
     
     return b_out;
 }

  f_simmetria_lng=function(bordo,c_lng){

      b_out=new GLatLngBounds();

      dist_asse=/*Math.abs*/(bordo.getSouthWest().lng()-c_lng);
           n_lng=bordo.getSouthWest().lng()-2*dist_asse;
      //n_lng=c_lng-dist_asse;
      b_out.extend(new GLatLng(bordo.getSouthWest().lat(),n_lng));
      
      dist_asse=/*Math.abs*/(bordo.getNorthEast().lng()-c_lng);
      n_lng=bordo.getNorthEast().lng()-2*dist_asse;
      //n_lng=c_lng-dist_asse;
      b_out.extend(new GLatLng(bordo.getNorthEast().lat(),n_lng));
      
      return b_out;
  }

  f_simmetria=function(bordo,sx,sy,b0){
      
      c_lat=b0.getCenter().lat();
      c_lng=b0.getCenter().lng();
            
      b_out=new GLatLngBounds();

      if(sx<0 && sy<0){
	  // Simm rispetto al centro
	  
	  b_out=this.f_simmetria_lat(bordo,c_lat);
	  b_out=this.f_simmetria_lng(b_out,c_lng);
	  
	  return b_out;
      }
      if(sx>=0 && sy<0){

	  // Simmetria risp. lat
	  
	  b_out=this.f_simmetria_lat(bordo,c_lat);
	  
	  return b_out;
      }

      if(sx<0 && sy>=0){

	  // Simmetria risp. lon
	  
	  b_out=this.f_simmetria_lng(bordo,c_lng);
	  
	  return b_out;
	 
      }
      return bordo;
  }

  f_rettangoli=function(b0,b1){
        
      var rettangoli=[];

      var sy=(b1.getSouthWest().lat()-b0.getSouthWest().lat());
      var sx = b1.getSouthWest().lng() - b0.getSouthWest().lng();
      

      // Calcolo lo spostamento assoluto
      var sya=Math.abs(b1.getSouthWest().lat()-b0.getSouthWest().lat());
      var sxa=Math.abs(b1.getSouthWest().lng()-b0.getSouthWest().lng());

      ay=b0.getSouthWest().lat();
      ax=b0.getSouthWest().lng();
      by=b0.getNorthEast().lat();
      bx=b0.getNorthEast().lng();

      ayp=ay+sya;axp=ax+sxa;
      byp=by+sya;bxp=bx+sxa;

      cy=by;cx=axp;

      r=new GLatLngBounds();
      r.extend(new GLatLng(cy,cx));
      r.extend(new GLatLng(byp,bxp));
      r=this.f_simmetria(r,sx,sy,b0);
      rettangoli.push(r);
      
      var dy=ayp;
      var dx=bx;
      var ey=by;
      var ex=bxp;
      
      r=new GLatLngBounds();
      r.extend(new GLatLng(dy,dx));
      r.extend(new GLatLng(ey,ex));
      r=this.f_simmetria(r,sx,sy,b0);
      rettangoli.push(r);

      return rettangoli;

  }
         
         
    estendi_bordi=function(bordi,delta){
        minLat = parseFloat(bordi.getSouthWest().lat())-delta;
	maxLat = parseFloat(bordi.getNorthEast().lat())+delta;
        minLng = parseFloat(bordi.getSouthWest().lng())-delta;
        maxLng = parseFloat(bordi.getNorthEast().lng())+delta;	     
	bordi.extend(new GLatLng (minLat , minLng ));
	bordi.extend(new GLatLng (maxLat ,maxLng ));
	return bordi;
    }