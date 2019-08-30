import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public firstName: string;
  public displayName: string;
  public age: number;
  public gender: string;
  public nationalities: string[];

  constructor (private http: HttpClient) { }

  getAge(nameInputValue: string) {
    return this.http.get('https://api.agify.io/?name=' + nameInputValue);
  }

  getGender(nameInputValue: string) {
    return this.http.get('https://api.genderize.io/?name=' + nameInputValue);
  }

  getNationality(nameInputValue: string) {
    return this.http.get('https://api.nationalize.io/?name=' + nameInputValue);
  }

  getCountryByCode(countryCode: string) {
    return this.http.get('https://restcountries.eu/rest/v2/alpha/' + countryCode);
  }

  guessInfoClick(nameInputValue) {
    this.displayName = nameInputValue;
    this.getAge(nameInputValue).subscribe((ageData: any) => {
      this.age = ageData.age;
      // TODO: Extra stats (count)
    });
    this.getGender(nameInputValue).subscribe((genderData: any) => {
      this.gender = genderData.gender;
    });
    this.getNationality(nameInputValue).subscribe((nationalityData: any) => {
      this.nationalities = [];
      nationalityData.country.forEach((country: any, index: number) => {
        this.nationalities.push('');
        this.getCountryByCode(country.country_id).subscribe((countryData: any) => {
          this.nationalities[index] = countryData.demonym;
        });
      });
    });
  }
}
