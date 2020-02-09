

module.exports={
  getdataWithString(sourceObject, string){
    if(sourceObject.constructor===Object ){
      let strings = string.split('.');
      let finalData=sourceObject;
      strings.forEach((elem)=>{
        if(elem!==''){
          finalData=finalData[elem];
        }
      });

      return finalData;
    }else{
      throw 'sourceObject must be an object';
    }
  },
  setdataWithString(sourceObject, string, data){
    if(sourceObject.constructor===Object ){
      let strings = string.split('.');
      let finalDestination=sourceObject;
      strings.forEach((elem, index)=>{
        if(finalDestination[elem]){
          finalDestination=finalDestination[elem];
        }else{
          finalDestination[elem]={};
        }
        if(index===strings.length-1){
          finalDestination[elem]=data;
        }
      });

      finalDestination=data;
      return finalDestination;
    }else{
      throw 'sourceObject must be an object';
    }
  },

  /**
   * will set data based on hierarchy to a destination object
   * @param destinationObject
   * @param hierarchy
   */
  setDatawithHierarchy(destinationObject, hierarchy){

    if(destinationObject && destinationObject.constructor === Object && hierarchy && hierarchy.constructor === Object){
      let strings = this.getStringOutOfHierarchy(hierarchy);

      strings.map((elem)=>{
        this.setdataWithString(destinationObject, elem, this.getdataWithString(hierarchy, elem));
      });
    }else{
      throw 'argument must be objects and not null';
    }

  },


  /**
   * Will return a list of hierarchy strings based on the parameter object
   * @param obj
   * @returns {Array}
   */
  getStringOutOfHierarchy(obj){
    let finalString=[];
    let lastString=[];
    let stringHierarachy = recHierarchy(obj, Object.keys(obj))[0];

    finalString.map(elem=>{
      if(elem.constructor===Array){
        elem.forEach(
          (subelem=>{
            lastString.push(subelem);
          })
        );
      }
    });
    return lastString;


    function recHierarchy(obj, initial){
      if(Object.keys(obj).length!=0){
        return Object.keys(obj).map((elem)=>{
          let basString= elem;
          switch (typeof obj[elem]) {
          case 'string':{

            return [`${elem.toString()}`];
          }
          default :{
            return [`${elem.toString()}`];
          }
          case 'object':{
            if(obj[elem].constructor === Array ){
              return  [`${elem.toString()}`];
            }
            let returnedValue = recHierarchy(obj[elem]);
            let value = returnedValue.map(
              (elem)=>{
                if(elem.constructor === Array){
                  return elem.map(
                    (subelem)=>{
                      return `${basString}.${subelem.toString()}`;
                    }
                  );
                }
                return `${basString}.${elem.toString()}`;
              }
            );
            (initial && initial.indexOf(elem)!==-1)?finalString=finalString.concat(value) :null;
            return value;
          }

          }
        });
      }else{
        return [''];
      }

    }
  },
};
