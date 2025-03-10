import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { GoldHistoryService } from '../../services/gold-history.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-gold-graph',
  templateUrl: './gold-graph.component.html',
  styleUrls: ['./gold-graph.component.css']
})
export class GoldGraphComponent implements OnInit {
  @Input() id: number = 1;  // Receive id as an input (1 for grams, 2 for ounces)
  dataPoints: any = [];
  chart: any;

  constructor(
    @Inject(GoldHistoryService) private goldHistoryService: GoldHistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  // Dynamic chart options based on the 'id'
  chartOptions = {
    theme: "dark2",
    zoomEnabled: true,
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Forex.com",
      fontFamily: "Roboto",
      fontWeight: "bold",
      margin: 10,
      fontColor: "white",
      padding: 1,
    },
    height: 240,
    legend: {
      fontFamily: "Roboto",
      fontColor: "#b18d5f",
    },
    subtitles: [{
      text: "Loading Data...",
      fontSize: 10,
      horizontalAlign: "center",
      verticalAlign: "center",
      dockInsidePlotArea: true
    }],
    axisY: {
      title: "Price per Unit (in USD)",
      prefix: "$"
    },
    toolbar: {
      itemBackgroundColorOnHover: "gold",
      itemBackgroundColor: "gold",
      buttonBorderColor: "gold",
      buttonBorderThickness: 4,
      fontColor: "black",
      fontColorOnHover: "#b18d5f",
      color: "gold"
    },
    data: [{
      indexlabelLineThickness:2,
      type: "spline",
      name: "",
      lineColor: "gold",  // Default color, will change based on 'id'
      color: "white",
      yValueFormatString: "$#,###.00",
      xValueType: "dateTime",
      dataPoints: this.dataPoints
    }]
  };

  getChartInstance(chart: object) {
    this.chart = chart;
    this.loadGoldPrices();  // Ensure the chart is ready before modifying subtitles
  }

  ngOnInit(): void {
    // Update chart title based on the `id`
    if (this.id === 1) {
      this.chartOptions.title.text = "Gold Price per Gram";
      this.chartOptions.data[0].name = "Gold Price per Gram";
      this.chartOptions.axisY.title="Price per Gram (in USD)";
    } else if (this.id === 2) {
      this.chartOptions.title.text = "Gold Price per Ounce";
      this.chartOptions.data[0].name = "Gold Price per Ounce";
      this.chartOptions.axisY.title="Price per Ounce (in USD)";
    }

    // Manually trigger change detection to ensure the updated options are reflected
    this.cdr.detectChanges();
  }

  private loadGoldPrices() {
    this.goldHistoryService.getGoldPriceHistory().subscribe(
      (response: any) => {
        if (response.isSuccess && response.result.length > 0) {
          this.dataPoints.length = 0;

          // Push data depending on the `id`
          response.result.forEach((data: any) => {
            if (this.id === 1) {
              // For Grams
              this.dataPoints.push({ x: new Date(data.date), y: Number(data.priceGram) });
            } else if (this.id === 2) {
              // For Ounces
              this.dataPoints.push({ x: new Date(data.date), y: Number(data.priceOunce) });
            }
          });

          // Remove the "Loading Data..." subtitle after data is loaded
          if (this.chart) {
            this.chart.subtitles[0].remove();
            this.chart.render();  // Re-render the chart after the data is updated
          }
        } else {
          if (this.chart) {
            this.chart.subtitles[0].set("text", "No Data Available");
          }
        }
      },
      () => {
        if (this.chart) {
          this.chart.subtitles[0].set("text", "Failed to Load Data");
        }
      }
    );
  }
}
