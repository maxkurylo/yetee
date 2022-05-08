import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {GroupOrUser, makeObjectReadonly} from "./init.service";

@Injectable({
    providedIn: 'root'
})
export class CompaniesService {
    private _selectedCompany: Company | null = null;
    private _allCompanies: Company[] = [];

    private selectedCompanyChangedSubject = new Subject<Company | null>();
    private companiesListChangedSubject = new Subject<void>();

    get selectedCompany(): Company | null { return this._selectedCompany }
    get allCompanies(): Company[] { return this._allCompanies }

    set selectedCompany(company: Company | null) {
        localStorage.selectedCompanyId = company?.id;
        this._selectedCompany = company;
        this.selectedCompanyChangedSubject.next(company);
    }

    set allCompanies(companies: Company[]) {
        this._allCompanies = companies.map((g: Company) => makeObjectReadonly(g));
        this.companiesListChangedSubject.next();
    };

    currentCompanyChanged = this.selectedCompanyChangedSubject.asObservable();
    companiesListChanged = this.companiesListChangedSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    getCompanyById(id: string): Company | null {
        const group = this.allCompanies.filter(g => g.id === id)[0];
        return group || null;
    }

    // BE requests

    fetchAllCompanies(): Observable<any> {
        return this.http.get('/api/everything/get-all-companies').pipe(take(1));
    }

    createCompany(company: CompanyCreation) {
        return this.http.post('/api/everything/create-company', company);
    }

    removeCompany(id: string) {
        return this.http.post('/api/everything/create-company', { id });
    }
}

export interface CompanyCreation {
    name: string;
    avatarUrl?: string;
}


export interface Company {
    id: string,
    name: string,
    avatarUrl?: string,
}