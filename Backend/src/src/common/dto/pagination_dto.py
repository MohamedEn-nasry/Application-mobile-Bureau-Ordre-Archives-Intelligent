from rest_framework import pagination
from rest_framework.response import Response
from rest_framework.utils.serializer_helpers import ReturnDict, ReturnList


class CustomPagination(pagination.PageNumberPagination):
    """Custom pagination class for consistent API responses."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'current_page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
                'page_size': self.page_size,
                'total_items': self.page.paginator.count,
                'has_next': self.page.has_next(),
                'has_previous': self.page.has_previous(),
            },
            'data': data
        })


class PaginationDTO:
    """Data Transfer Object for pagination parameters."""
    
    def __init__(self, page=1, page_size=20):
        self.page = max(1, int(page))
        self.page_size = min(100, max(1, int(page_size)))
        self.offset = (self.page - 1) * self.page_size
        self.limit = self.page_size

    @property
    def pagination_params(self):
        return {
            'offset': self.offset,
            'limit': self.limit
        }

    def to_dict(self):
        return {
            'page': self.page,
            'page_size': self.page_size,
            'offset': self.offset,
            'limit': self.limit
        }
