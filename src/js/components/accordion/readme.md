# Accordion component

This custom element recreates the bootstrap accordion component functionality without the jquery dependency

## Sample markup

```
<cwds-accordion>
  <div class="card">
    <div class="card-header py-20" id="headingOne">
      <button class="btn btn-link" type="button" aria-expanded="false">
        Learners
      </button>
    </div>
    <div class="card-container collapse" aria-labelledby="headingOne">
      <div class="card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </div>
  </div>
</cwds-accordion>
```