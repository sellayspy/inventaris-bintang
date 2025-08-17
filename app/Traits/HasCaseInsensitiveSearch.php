<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HasCaseInsensitiveSearch
{
    /**
     *
     *
     * @param Builder $query
     * @param Request $request
     * @param array $columns
     * @param string|null $searchKey
     * @return Builder
     */

    public function scopeApplyCaseInsensitiveSearch(Builder $query, Request $request, array $columns, ?string $searchKey = 'search')
    {
        $search = $request->input($searchKey);

        if (!empty($search)) {
            $search = strtolower($search);

            $query->where(function ($q) use ($columns,$search) {
                foreach ($columns as $column) {
                    if(strpos($column, '.' ) !== false) {
                        [$relation, $relColumn] = explode('.', $column, 2);
                        $q->orWhereHas($relation, function ($relQuery) use ($relColumn, $search) {
                            $relQuery->whereRaw("LOWER($relColumn) LIKE ?", ["%{$search}%"]);
                        });
                    } else {
                        $q->orWhereRaw("LOWER($column) LIKE ?", ["%{$search}%"]);

                    }
                }
            });
        }

        return $query;
    }
}
