import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Bubble } from 'react-chartjs-2';

import {
  Wrap, Text, Image, Info, Separator,
} from './styles';

const BubbleChart = ({ data, title, info }) => {
  const [chartData, setChartData] = useState({});
  const [callable, setCallable] = useState(false);

  useEffect(() => {
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      newData.push({
        x: data[i].data.x,
        y: data[i].data.y,
        r: data[i].data.r,
      });
    }

    setChartData(
      {
        datasets: [
          {
            lineTension: 0.2,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 0.5,
            pointHitRadius: 2,
            data: newData,
          },
        ],
      }
    )

    setCallable(true);
  }, []);

  return (
    <div>
      {callable ? (
        <div>
          <Wrap>
            <div>
              <a href={info.external_urls.spotify}>
                <Image src={info.images[0].url} alt="album" />
              </a>
            </div>
            <Info>
              <Text>
                Name:&nbsp;<strong>{info.name}</strong>
              </Text>
              Owner:&nbsp;{info.owner.display_name}
              <br />
            </Info>
          </Wrap>
          <Separator />
          <Bubble
            data={chartData}
            width={650}
            height={500}
            options={{
              title: {
                display: true,
                text: title,
                fontSize: 15,
              },
              tooltips: {
                enabled: true,
              },
              maintainAspectRatio: false,
            }}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

BubbleChart.propTypes = {
  data: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  info: PropTypes.func.isRequired,
};

export default BubbleChart;
