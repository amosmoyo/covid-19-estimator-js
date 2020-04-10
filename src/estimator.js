const days = (periodType, timeToElapse) => {
  let day;
  const time = timeToElapse;
  switch (periodType) {
    /* eslint-disable indent */
      case 'months':
      day = time * 30;
      break;
      case 'weeks':
      day = time * 7;
      break;
      default:
      day = time;   
  }

  const ans = 2 ** (Math.floor((day / 3)));

  return ans;
  
};

const impact = {};

const severeImpact = {};

const hospitalBeds = (severe, beds) => {
  const occupiedBeds = Math.floor(0.65 * beds);

  const accualCapacity = Math.floor(0.925 * beds);

  const remainBedActualCapity = Math.floor(accualCapacity - occupiedBeds);

  const requiredBeds = (severe - remainBedActualCapity);
  return requiredBeds;
};

const incomeLost = (infected, time, income) => ((infected * time * income).toFixed(2));

const estimator = (val) => {
  impact.currentlyInfected = val.reportedCases * 10;
  impact.infectionsByRequestedTime = impact.currentlyInfected * days(
  val.periodType, val.timeToElapse);
  impact.severeCasesByRequestedTime = Math.floor(0.15 * impact.infectionsByRequestedTime);

  impact.hospitalBedsByRequestedTime = hospitalBeds(
  impact.severeCasesByRequestedTime, val.totalHospitalBeds);

  impact.casesForICUByRequestedTime = Math.floor(0.05 * impact.infectionsByRequestedTime);
  impact.casesForVentilatorsByRequestedTime = Math.floor(0.02 * impact.infectionsByRequestedTime);

  impact.dollarsInFlight = incomeLost(
    impact.infectionsByRequestedTime,
    val.timeToElapse,
    val.region.avgDailyIncomeInUSD
  );

  severeImpact.currentlyInfected = val.reportedCases * 50;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * days(
  val.periodType, val.timeToElapse);
  severeImpact.severeCasesByRequestedTime = Math.floor(0.15 * severeImpact.infectionsByRequestedTime);

  severeImpact.hospitalBedsByRequestedTime = hospitalBeds(
  severeImpact.severeCasesByRequestedTime, val.totalHospitalBeds);

  severeImpact.casesForICUByRequestedTime = Math.floor(0.05 * severeImpact.infectionsByRequestedTime);
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(0.02 * severeImpact.infectionsByRequestedTime);
  severeImpact.dollarsInFlight = incomeLost(
    severeImpact.infectionsByRequestedTime,
    val.timeToElapse,
    val.region.avgDailyIncomeInUSD
  );

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
