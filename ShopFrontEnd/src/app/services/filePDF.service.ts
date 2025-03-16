import { Injectable } from '@angular/core';
import jspdf from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ServiciuPDFService {

  constructor() { }

  imagineAvion: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3kAAAB/CAIAAADdI5wCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA0LTE4VDEzOjQ0OjMxKzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA0LTE4VDEzOjQ0OjMxKzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNC0xOFQxMzo0NDozMSswMzowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYjIxMmFjMS1jYjNmLTBkNDYtOTdlNy1mMjA1M2MwZDMzYjEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjYWEyM2ZiNi1mYzg4LWUxNDgtOTNm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"


  generarePDF(nume: string, aplecare: string, asosire: string, oplecare: string, ososire: string, oraP: string, oreZ: number, minZ: number, loc: string, codZbor: string, initiale: string) {
    const doc = new jspdf('l', 'mm', [160, 300]);

    //Titlu

    doc.setFillColor(6, 66, 112);
    doc.rect(0, 0, 300, 25, 'F');

    doc.setFont("Roboto");
    doc.setFontSize(30);
    doc.setTextColor(255, 255, 255);
    doc.text("SibAir - Boarding ticket", 150, 17, { align: 'center' });

    //Cod aeroport stanga
    doc.setTextColor(0, 0, 0);
    doc.setFont("Roboto");
    doc.setFontSize(60);
    doc.text(aplecare, 50, 57, { align: 'center' });

    //Cod aeroport dreapta
    doc.text(asosire, 250, 57, { align: 'center' });


    //Oras stanga
    doc.setFont("Roboto");
    doc.setFontSize(22);
    doc.text(oplecare, 50, 69, { align: 'center' });


    //Oras dreapta
    doc.text(ososire, 250, 69, { align: 'center' });

    //Ora plecare stanga
    doc.setFontSize(15);
    doc.setTextColor(130, 130, 130);
    doc.text(oraP, 50, 78, { align: 'center' });

    //Durata zbor
    doc.text(oreZ+"h "+minZ+"m", 149, 69, { align: 'center' });

    //Ora sosire dreapta
    let minutSosire = Number(oraP.split(':')[1]) + Number(minZ);
    let oraSosire = Number(oraP.split(':')[0]) + Number(oreZ);
    if (minutSosire >= 60) {
      oraSosire++;
      minutSosire = minutSosire - 60;
    }

    let stringMinutSosire;

    if (minutSosire == 0) {
      stringMinutSosire = "00";
    } else {
      stringMinutSosire = String(minutSosire);
    }
      

    doc.text(oraSosire + ":" + stringMinutSosire, 250, 78, { align: 'center' });

    //Chenar mijloc nume
    doc.setFont("Roboto");
    doc.setFontSize(30);

    let latimeNume = doc.getTextWidth(nume) + 15
    let dreapta = 150 - latimeNume / 2;
    let latime = latimeNume;

    doc.setFillColor(6, 66, 112);
    doc.roundedRect(dreapta, 90, latime, 20, 5, 5, 'F')


    //Nume pasager
    doc.setFont("Roboto");
    doc.setFontSize(30);
    doc.setTextColor(255, 255, 255);
    doc.text(nume, 150, 104, { align: 'center' })

    //Imagine avion
    doc.addImage(this.imagineAvion, "PNG", 83, 40, 133, 19);

    //Loc in avion
    doc.setFont("Roboto");
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("Loc - "+loc, 150, 121, { align: 'center' })

    //Prezinta cod
    doc.setFontSize(13);
    doc.setTextColor(130, 130, 130);
    doc.text("Prezintă acest cod la îmbarcare", 150, 142, { align: 'center' });

    //Chenar cod

    let genereazaCod = "SibAir_"+codZbor + "_" + aplecare + "_" + asosire + "_" + initiale + "_" + loc;

    let latimeCod = doc.getTextWidth(genereazaCod) + 25;
    let dreaptaCod = 150 - latimeCod / 2;
    let latimeChenarCod = latimeCod;

    doc.setFillColor(6, 66, 112);
    doc.roundedRect(dreaptaCod, 145, latimeChenarCod, 12, 5, 5, 'F')


    //Cod
    doc.setFont("Montserrat-SemiBold");
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text(genereazaCod, 150, 153, { align: 'center' });

    //Semnatura stanga
    doc.setFont("Montserrat-Regular");
    doc.setFontSize(12);
    doc.setTextColor(130, 130, 130);
    doc.text("Robert Berbescu • 2023", 2, 157);

    //Semnatura dreapta
    doc.text("Programare Web • Anul 2", 243, 157);

    //Scoate fisierul
    doc.save("Bilet - " + nume + " (" + aplecare +" - "+asosire+")");

  }


}
