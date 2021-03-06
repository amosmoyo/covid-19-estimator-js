const impact = {
};
const severeImpact = {
};

const days = function timeLP(periodType, timeToElapse) {
  let day;
  const time = timeToElapse;
  if (periodType === 'months') {
    day = time * 30;
  } else if (periodType === 'weeks') {
    day = time * 7;
  } else {
    day = time;
  }
  const ans = (2 ** (Math.trunc((day / 3))));
  return ans;
};

const hospitalBeds = function hospitalBd(severeCase, beds) {
  const remainBedActualCapity = 0.35 * beds;

  const requiredBeds = (remainBedActualCapity - severeCase);
  return Math.trunc(requiredBeds);
};

const incomeLost = function incu(infected, income, pop, time, periodType) {
  let day;
  if (periodType === 'months') {
    day = time * 30;
  } else if (periodType === 'weeks') {
    day = time * 7;
  } else {
    day = time;
  }
  return Math.trunc((infected * pop * income) / (day));
};

const estimator = (val) => {
  impact.currentlyInfected = val.reportedCases * 10;
  impact.infectionsByRequestedTime = impact.currentlyInfected * days(
    val.periodType, val.timeToElapse
  );
  impact.severeCasesByRequestedTime = Math.trunc(0.15 * impact.infectionsByRequestedTime);

  impact.hospitalBedsByRequestedTime = hospitalBeds(
    impact.severeCasesByRequestedTime, val.totalHospitalBeds
  );

  impact.casesForICUByRequestedTime = Math.trunc(0.05 * impact.infectionsByRequestedTime);
  impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * impact.infectionsByRequestedTime);

  impact.dollarsInFlight = incomeLost(
    impact.infectionsByRequestedTime,
    val.region.avgDailyIncomeInUSD,
    val.region.avgDailyIncomePopulation,
    val.timeToElapse,
    val.periodType
  );

  severeImpact.currentlyInfected = val.reportedCases * 50;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * days(
    val.periodType, val.timeToElapse
  );
  severeImpact.severeCasesByRequestedTime = Math.trunc(
  0.15 * severeImpact.infectionsByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = hospitalBeds(
    severeImpact.severeCasesByRequestedTime, val.totalHospitalBeds
  );
  severeImpact.casesForICUByRequestedTime = Math.trunc(
  0.05 * severeImpact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
  0.02 * severeImpact.infectionsByRequestedTime
  );
  severeImpact.dollarsInFlight = incomeLost(
    severeImpact.infectionsByRequestedTime,
    val.region.avgDailyIncomeInUSD,
    val.region.avgDailyIncomePopulation,
    val.timeToElapse,
    val.periodType
  );
};

const covid19ImpactEstimator = (data) => {
    estimator(data);

    return {
        data,
        impact,
        severeImpact
    };
};

export default covid19ImpactEstimator;
