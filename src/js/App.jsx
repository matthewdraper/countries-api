import React, { Component } from 'react';
import Error from "./Error";
import axios from 'axios';

class App extends Component{

    constructor() {
        super();
        this.state = {
            errorMessage: '',
            totalCountries: 0,
            countries: [],
            regions: [],
            subregions: [],
            countryTable: {
                rows: []
            },
            regionTable: {
                rows: []
            },
            subregionTable: {
                rows: []
            },
            searchValue: ''
        };
    }

    render(){
        let style = {
            minWidth: '4rem'
        };
        return(
            <div className={'container'}>
                <h1 className={'mt-5 mb-3'}>Country Search</h1>
                <Error text={this.state.errorMessage} />
                <div className={'search-bar form-group my-3'}>
                    <input placeholder={'Search by name or ISO abbreviation'} className={'search-bar__input form-control'} value={this.state.searchValue} onChange={evt => this.updateSearchValue(evt)} onMouseLeave={evt => this.updateSearchValue(evt)} onKeyPress={evt => this.keyPressed(evt)}/>
                    <button className={'search-bar__input btn btn-primary'} onClick={evt => { this.search();}}><i className={'fas fa-search'}></i></button>
                </div>
                <div className={'h4 my-3'}>Countries</div>
                <table className={'w-100 table table-bordered table-striped table-hover table-sm'}>
                    <thead>
                        <tr>
                            <th>Flag</th>
                            <th>Name</th>
                            <th>Population</th>
                            <th style={style}>ISO-2</th>
                            <th style={style}>ISO-3</th>
                            <th>Region</th>
                            <th>Sub-Region</th>
                            <th>Languages</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.countryTable.rows}
                    </tbody>
                </table>
                <div className={'totals h4 my-5'}>Total Countries: {this.state.totalCountries}</div>
                <div className={'row'}>
                    <div className={'col'}>
                        <div className={'h4 mb-2'}>Regions</div>
                        <table className={'w-100 table table-bordered table-striped table-hover table-sm'}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.regionTable.rows}
                            </tbody>
                        </table>
                    </div>
                    <div className={'col'}>
                        <div className={'h4 mb-2'}>Sub-Regions</div>
                        <table className={'w-100 table table-bordered table-striped table-hover table-sm'}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.subregionTable.rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.allCountries();
    }

    keyPressed(evt) {
        this.setState({
            searchValue: evt.target.value
        })
        if (evt.key === "Enter") {
            this.search()
        }
    }

    updateSearchValue(evt) {
        this.setState({
            searchValue: evt.target.value
        })
    }

    createCountryTableRows() {
        let rows = [];
        let imgStyle = {
            width: '40px',
            height: 'auto',
            border: '1px solid #ccc'
        };
        for (let i = 0; i < this.state.countries.length; i++){
            let rowID = `row${i}`;
            let cell = [];
            cell.push(<td key='flag'><img style={imgStyle} className={'flag-image'} src={this.state.countries[i].flag} alt={this.state.countries[i].name}/></td>);
            cell.push(<td key='name'>{this.state.countries[i].name}</td>);
            cell.push(<td key='population'>{this.numberWithCommas(this.state.countries[i].population)}</td>);
            cell.push(<td key='alpha2Code'>{this.state.countries[i].alpha2Code}</td>);
            cell.push(<td key='alpha3Code'>{this.state.countries[i].alpha3Code}</td>);
            cell.push(<td key='region'>{this.state.countries[i].region}</td>);
            cell.push(<td key='subregion'>{this.state.countries[i].subregion}</td>);
            cell.push(<td key='languages'>{this.state.countries[i].languages}</td>);


            rows.push(<tr key={i} id={rowID}>{cell}</tr>)
        }
        return rows;
    }

    createRegionTableRows() {
        let regions = [];

        for (let region in this.state.regions) {
            regions.push({name: region, count: this.state.regions[region]});
        }

        regions.sort(function(a, b) {
            return  b.count - a.count;
        });

        let rows = [];
        for (let i = 0; i < regions.length; i++){
            let cell = [];

            cell.push(<td key='name'>{regions[i].name}</td>);
            cell.push(<td key='count'>{this.numberWithCommas(regions[i].count)}</td>);

            rows.push(<tr>{cell}</tr>)
        }
        return rows;
    }

    createSubregionTableRows() {
        let subregions = [];

        for (let region in this.state.subregions) {
            subregions.push({name: region, count: this.state.subregions[region]});
        }

        subregions.sort(function(a, b) {
            return  b.count - a.count;
        });

        let rows = [];
        for (let i = 0; i < subregions.length; i++){
            let cell = [];

            cell.push(<td key='name'>{subregions[i].name}</td>);
            cell.push(<td key='count'>{this.numberWithCommas(subregions[i].count)}</td>);

            rows.push(<tr>{cell}</tr>)
        }
        return rows;
    }

    allCountries() {
        this.getCountries('/api/index.php');
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

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    search() {
        if(this.state.searchValue.trim() !== '' && this.state.searchValue !== undefined && this.state.searchValue !== null){
            this.getCountries('api/index.php?search=' + encodeURI(this.state.searchValue));
        } else {
            this.setState({errorMessage: 'Search field cannot be empty'});
            this.setState({searchValue: ''});
        }
    }

    getCountries(url) {
        axios(url).then(result => {
            if(result.status === 200 && result.data.status === 200) {
                this.setState({errorMessage: ''});

                let payload = result.data.payload;


                let countries = payload.map(country => {
                    let languages = country.languages;
                    languages = languages.map(language => language.name);
                    country.languages = languages.join(', ');
                    return country;
                });

                this.setState({totalCountries: payload.length});
                this.setState({countries: countries});

                let regions = payload.map(country => country.region);
                let subregions = payload.map(country => country.subregion);

                this.setState({regions: this.regions(regions)});
                this.setState({subregions: this.regions(this.flatten(subregions))});

                this.setState({countryTable: {rows: this.createCountryTableRows()}});
                this.setState({regionTable: {rows: this.createRegionTableRows()}});
                this.setState({subregionTable: {rows: this.createSubregionTableRows()}});
            } else {
                this.setState({errorMessage: 'There were no countries matching "' + this.state.searchValue + '"'});
            }
        });
    }
}
export default App;
