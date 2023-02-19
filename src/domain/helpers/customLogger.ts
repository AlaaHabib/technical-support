export function CustomLogger(...args: any) {

  const isDevelopment = `${process.env.NEST_ENV}` === 'development';
  if(isDevelopment){
      console.log('--------------------- [ Development Logger ] -------------------------');
      console.log(...args);
      console.log('----------------------------------------------------------------------');
  }
}
