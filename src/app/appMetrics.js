const Operation = require('../app/Operation');

class appMetrics extends Operation {


  constructor({config, logger}){

    super();
    this.config=config;
    this.logger=logger;
    //find out if appMetrics is enabled :
    if(this.config.appMetrics.userAppMetric===false){
      this.logger.info('App metrics is disabled, no Application metrics will be recorded or available through API');
      return undefined;
    }

    const appmetrics = require('appmetrics');

    //enabling metrics types :

    let numberOMetricsEnabled =0;
    let numberOfMetricsEnablingErrors=0;
    Object.keys(config.appMetrics.tracking).map((elem, index)=>{
      let type= config.appMetrics.tracking[elem];
      try{
        switch (typeof type) {
        case Boolean:{
          appmetrics.enable(type, {});
          numberOMetricsEnabled++;
          break;
        }
        case Object:{
          if(type.use===true){
            if(type.config){
              appmetrics.enable(type, type.config);
              numberOMetricsEnabled++;
            }
          }
          break;
        }
        }
      }catch (e) {
        numberOfMetricsEnablingErrors++;
      }
    });

    this.logger.info(`${numberOMetricsEnabled} metric(s) has been enabled`);
    this.logger.info(`${numberOfMetricsEnablingErrors} metric(s) have errored or were not loaded`);

    //initializing monitor app.
    this.monitoring = appmetrics.monitor();


    //setting the outputs and attaching events
    appMetrics.setOutputs(Object.keys(config.appMetrics.tracking).map((elem)=> {

      this.monitoring.on(elem.toLowerCase(), (data) => {
        this.emit(elem.toUpperCase(),data);
      });

      return elem.toUpperCase();
    }));

  }

}




module.exports = appMetrics;
