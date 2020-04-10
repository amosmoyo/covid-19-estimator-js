const days = (periodType,timeToElapse) => {
  let day;
  const time = timeToElapse;
  switch (periodType) {
    case 'months':
      day = time * 30;
    break;
    case 'weeks':
      day = time * 7;
    break;
    default:
      day = time   
  }
  const ans = Math.pow(2, Math.floor((day/3)));
  return ans;
};

const impact = {};
const severeImpact = {};

const estimator = (val) => {
  const input = val;
  const reportedCases = input.reportedCases;
  const time = input.timeToElapse;
  const period = input.periodType;
  const beds = input.totalHospitalBeds;
  const income = input.region.avgDailyIncomeInUSD;
  
  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = impact.currentlyInfected * days(period,time);
  impact.severeCasesByRequestedTime = Math.floor(0.15 * impact.infectionsByRequestedTime);
  impact.hospitalBedsByRequestedTime = hospitalBeds(impact.severeCasesByRequestedTime, beds);
  impact.casesForICUByRequestedTime = Math.floor(0.05 * impact.infectionsByRequestedTime);
  impact.casesForVentilatorsByRequestedTime = Math.floor(0.02 * impact.infectionsByRequestedTime);
  impact.dollarsInFlight = incomeLost(
    impact.infectionsByRequestedTime,
    time,
    income
  )

  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * days(period, time);
  severeImpact.severeCasesByRequestedTime = Math.floor(0.15 * severeImpact.infectionsByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = hospitalBeds(severeImpact.severeCasesByRequestedTime, beds);
  severeImpact.casesForICUByRequestedTime = Math.floor(0.05 * severeImpact.infectionsByRequestedTime);
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(0.02 * severeImpact.infectionsByRequestedTime);
  severeImpact.dollarsInFlight = incomeLost(
    severeImpact.infectionsByRequestedTime,
    time,
    income
  )

}

const hospitalBeds = (severe, beds) => {
   const occupiedBeds = Math.floor(0.65 * beds);
   const accualCapacity = Math.floor(0.925 * beds );
   const remainBedActualCapity = Math.floor(accualCapacity - occupiedBeds);
   const requiredBeds = severe - remainBedActualCapity;
   return requiredBeds;
}


const incomeLost = (infected, time, income) => {
    return (infected * time * income).toFixed(2);
}

const covid19ImpactEstimator = (data) => {
    estimator(data);

    return {
        data,
        impact,
        severeImpact,
    }
}

export default covid19ImpactEstimator;
