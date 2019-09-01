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
  public loadedObj;
  public loadedBool = false;
  public missedArr: string = "";

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
    this.loadedBool = false;
    this.loadedObj = this.emptyLoaded(); // Make empty
    this.displayName = nameInputValue;
    this.getAge(nameInputValue).subscribe((ageData: any) => {
      this.age = ageData.age;
      this.loaded("age");
      // TODO: Extra stats (count)
    });
    this.getGender(nameInputValue).subscribe((genderData: any) => {
      this.gender = genderData.gender;
      this.loaded("gender");
    });
    this.getNationality(nameInputValue).subscribe((nationalityData: any) => {
      this.nationalities = [];
      nationalityData.country.forEach((country: any, index: number) => {
        this.nationalities.push('');
        this.loaded("nationalities");
        this.getCountryByCode(country.country_id).subscribe((countryData: any) => {
          this.nationalities[index] = countryData.demonym;
          this.loaded("countryByCode");
        });
      });
      if(!this.nationalities.length){
        this.loaded("nationalities");
        this.loaded("countryByCode");
      }
    });
  }

  emptyLoaded(){
    return {
      age: false,
      gender: false,
      nationalities: false,
      countryByCode: false
    }
  }

  loaded(name){
    this.loadedObj[name] = true;
    this.checkAllLoaded();
  }

  checkAllLoaded(){
    this.loadedBool = true;
    for(const o in this.loadedObj) {
      if(! this.loadedObj[o]) {
        this.loadedBool = false;
      }
    }
    if(this.loadedBool){
      this.missedArr = this.arrayToSentence();
    }
    console.log(this.loadedObj);
  }

  arrayToSentence () {
    let arr = [];
    if(!this.age) {
      arr.push("age");
    }
    if(!this.gender) {
      arr.push("gender");
    }
    if(!this.nationalities || !this.nationalities.length) {
      arr.push("nationality");
    }
    var last = arr.pop();
    return arr.join(', ') + ((arr.length > 1) ? ' and ' : ' ') + last;
  }
}