import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { PeliculasService } from '../../services/peliculas.service';
import { MovieResponse } from '../../interfaces/movie-response';
import { Cast } from '../../interfaces/credits-response';
import { combineLatest } from 'rxjs';
import { Movie } from 'src/app/interfaces/cartelera-response';

@Component({
  selector: 'app-pelicula',
  templateUrl: './pelicula.component.html',
  styleUrls: ['./pelicula.component.css']
})
export class PeliculaComponent implements OnInit {

  @HostListener('window:scroll', ['$event'])

  public pelicula: MovieResponse;
  public cast: Cast[] = [];

  public movies: Movie[] = [];

  public id: String;



  constructor(private activatedRoute: ActivatedRoute,
    private peliculasService: PeliculasService,
    private location: Location,
    private router: Router) {
    this.id = ""
  }



  ngOnInit(): void {

    const { id } = this.activatedRoute.snapshot.params;

    this.id = id;
    combineLatest([

      this.peliculasService.getPeliculaDetalle(id),
      this.peliculasService.getCast(id)

    ]).subscribe(([pelicula, cast]) => {

      if (!pelicula) {
        this.router.navigateByUrl('/home');
        return;
      }

      this.pelicula = pelicula;
      this.cast = cast.filter(actor => actor.profile_path !== null);
    });


    this.peliculasService.getPeliculasSimilares(id).subscribe(movies => {
      this.movies = movies;
    });

    // this.peliculasService.getPeliculaDetalle( id ).subscribe( movie => {
    // if ( !movie ) {
    //   this.router.navigateByUrl('/home');
    //   return;
    // }
    // this.pelicula = movie;
    // });

    // this.peliculasService.getCast( id ).subscribe( cast => {
    //   console.log(cast)
    //   this.cast = cast.filter( actor => actor.profile_path !== null );
    // });



  }

  onRegresar() {
    this.location.back();
  }

}
