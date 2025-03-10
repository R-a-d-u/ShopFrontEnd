import { Component, OnInit } from '@angular/core';
import { GoldHistoryService } from '../../services/gold-history.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-gold-graph',
  templateUrl: './gold-graph.component.html',
  styleUrls: ['./gold-graph.component.css']
})
export class GoldGraphComponent implements OnInit {
  dataPoints: any = [];
  chart: any;
  
  constructor(@Inject(GoldHistoryService) private goldHistoryService: GoldHistoryService) {}
  

  chartOptions = {
    theme: "light2",
    zoomEnabled: true,
    exportEnabled: true,
    title: {
      text: "Gold Price (Last 7 Days)"
    },
    subtitles: [{
      text: "Loading Data...",
      fontSize: 24,
      horizontalAlign: "center",
      verticalAlign: "center",
      dockInsidePlotArea: true
    }],
    axisY: {
      title: "Price per Ounce (in USD)",
      prefix: "$"
    },
    data: [{
      type: "line",
      name: "Gold Price",
      yValueFormatString: "$#,###.00",
      xValueType: "dateTime",
      dataPoints: this.dataPoints
    }]
  };

  getChartInstance(chart: object) {
    this.chart = chart;
    this.loadGoldPrices();  // Ensure the chart is ready before modifying subtitles
  }

  ngOnInit(): void {}

  private loadGoldPrices() {
    this.goldHistoryService.getGoldPriceHistory().subscribe(
      (response: any) => {
        if (response.isSuccess && response.result.length > 0) {
          this.dataPoints.length = 0;
          response.result.forEach((data: any) => {
            this.dataPoints.push({ x: new Date(data.date), y: Number(data.priceOunce) });
          });
          this.chart.subtitles[0].remove();
        } else {
          this.chart.subtitles[0].set("text", "No Data Available");
        }
      },
      () => {
        this.chart.subtitles[0].set("text", "Failed to Load Data");
      }
    );
  }
}



      