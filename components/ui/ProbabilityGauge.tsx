
import React from 'react';

interface ProbabilityGaugeProps {
  probability: number; // A value from 0 to 100
}

const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({ probability }) => {
  const getBarColor = (p: number): string => {
    if (p < 40) return 'bg-red-500';
    if (p < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const colorClass = getBarColor(probability);

  return (
    <div className="w-full bg-gray-700 rounded-full h-4 my-2" role="meter" aria-valuenow={probability} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`h-4 rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${probability}%` }}
        aria-label={`Probability: ${probability}%`}
      ></div>
    </div>
  );
};

export default ProbabilityGauge;
