import React, { Component } from 'react';
import axios from 'axios';

class App extends Component{

    constructor() {
        super();
        this.state = {
            totalCountries: 0,
            countries: [],
            regions: [],
            subregions: [],
        };
    }

    render(){
        return(
            <div>
                <h1>Country Search Template</h1>
                <p>This is here to get you started.</p>
            </div>
        );
    }

    componentWillMount() {
        this.allCountries()
    }

    allCountries() {
        axios('api/index.php').then(result => {
            let payload = result.data.payload;
            this.state.totalCountries = payload.length;
            this.state.countries = payload;

            let regions = payload.map(country => country.region);
            let subregions = payload.map(country => country.subregion);

            this.state.regions = this.regions(regions);
            this.state.subregions = this.regions(this.flatten(subregions));

            console.log(this.state.regions);
            console.log(this.state.subregions);
            console.log(this.state);
        })
    }

    regions(regions) {
        let counts = {};
        for (let i = 0; i < regions.length; i++) {
            let key = regions[i] !== '' ? regions[i] : 'None';
            counts[key] = 1 + (counts[key] || 0);
        }
        return counts;
    }

    flatten(arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }
}
export default App;
