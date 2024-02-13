"use client";
import React from 'react';

type Props = {
    district: string | undefined,
    numberOfQuestions: number,
};

const AnalyticsDashboard = ( { district, numberOfQuestions } : Props) => {

  return (
      <div className="flex flex-col items-center">
          <h2 className='font-bold'>District: {district}</h2>
          <h2 className='font-bold'>Number Of Questions Asked By Students:</h2>
          <a>{numberOfQuestions}</a>
      </div>
  )
}

export default AnalyticsDashboard